import React from 'react';
import PropTypes from 'prop-types';
import './OurTeam.css';

const teamMembers = {
  Red: [
    { id: '1', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '2', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
  Yellow: [
    { id: '3', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '4', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
  White: [
    { id: '5', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '6', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
  Black: [
    { id: '7', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '8', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
  Blue: [
    { id: '9', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '10', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
  Administrators: [
    { id: '11', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
    { id: '12', firstName: 'PlaceHolderName', lastName: 'PlaceHolderName', title: 'PlaceHolderRole', bio: 'PlaceHolderName does PlaceHolder.' },
  ],
};

const TeamMember = ({ firstName, lastName, title, bio }) => (
  <div className="team-member">
    <h3 className="member-name">{firstName} {lastName}</h3>
    <p className="member-title">{title}</p>
    <p className="member-bio">{bio}</p>
  </div>
);

TeamMember.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
};

const TeamSection = ({ teamName, members }) => (
  <div className={`team-section ${teamName.toLowerCase()}`}>
    <h2 className="team-name">{teamName} Team</h2>
    <div className="team-members">
      {members.map(member => (
        <TeamMember
          key={member.id}
          firstName={member.firstName}
          lastName={member.lastName}
          title={member.title}
          bio={member.bio}
        />
      ))}
    </div>
  </div>
);

TeamSection.propTypes = {
  teamName: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const OurTeam = () => (
  <div className="our-team">
    <h1>Our Team</h1>
    <div className="team-sections">
      {Object.entries(teamMembers).map(([teamName, members]) => (
        <TeamSection
          key={teamName}
          teamName={teamName}
          members={members}
        />
      ))}
    </div>
  </div>
);

export default OurTeam;
